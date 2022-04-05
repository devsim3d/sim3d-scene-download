(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\renderer\views\App.svelte generated by Svelte v3.46.6 */

    const { console: console_1 } = globals;
    const file = "src\\renderer\\views\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (63:8) {#each scenes as scene}
    function create_each_block(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*scene*/ ctx[13].id + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let th1;
    	let t4_value = /*scene*/ ctx[13].name + "";
    	let t4;
    	let t5;
    	let th2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t6;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*scene*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Descargar";
    			t3 = space();
    			th1 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			th2 = element("th");
    			img = element("img");
    			t6 = space();
    			add_location(button, file, 66, 20, 2267);
    			add_location(th0, file, 64, 16, 2211);
    			add_location(th1, file, 68, 16, 2385);
    			if (!src_url_equal(img.src, img_src_value = /*scene*/ ctx[13].screenshot)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*scene*/ ctx[13].name);
    			attr_dev(img, "class", "svelte-uvg8cz");
    			add_location(img, file, 69, 20, 2427);
    			add_location(th2, file, 69, 16, 2423);
    			attr_dev(tr, "class", "svelte-uvg8cz");
    			add_location(tr, file, 63, 12, 2190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(th0, t1);
    			append_dev(th0, button);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(th1, t4);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(th2, img);
    			append_dev(tr, t6);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*scenes*/ 16 && t0_value !== (t0_value = /*scene*/ ctx[13].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*scenes*/ 16 && t4_value !== (t4_value = /*scene*/ ctx[13].name + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*scenes*/ 16 && !src_url_equal(img.src, img_src_value = /*scene*/ ctx[13].screenshot)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*scenes*/ 16 && img_alt_value !== (img_alt_value = /*scene*/ ctx[13].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(63:8) {#each scenes as scene}",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#if lastScenePath !== ""}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Abrir";
    			add_location(button, file, 77, 8, 2613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(77:4) {#if lastScenePath !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let t6;
    	let div;
    	let table;
    	let tr;
    	let th0;
    	let t8;
    	let th1;
    	let t10;
    	let th2;
    	let t12;
    	let t13;
    	let p1;
    	let t14;
    	let t15;
    	let p1_class_value;
    	let mounted;
    	let dispose;
    	let each_value = /*scenes*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*lastScenePath*/ ctx[2] !== "" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Sim 3D scene download";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Introduzca la dirección de la aplicación Sim 3D desde donde quiere cargar las escenas";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Listar Escenas";
    			t6 = space();
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Escena";
    			t8 = space();
    			th1 = element("th");
    			th1.textContent = "Nombre";
    			t10 = space();
    			th2 = element("th");
    			th2.textContent = "Vista Previa";
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			p1 = element("p");
    			t14 = text(/*statusMessage*/ ctx[0]);
    			t15 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-uvg8cz");
    			add_location(h1, file, 51, 0, 1723);
    			add_location(p0, file, 52, 0, 1754);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-uvg8cz");
    			add_location(input, file, 53, 0, 1847);
    			add_location(button, file, 54, 0, 1897);
    			add_location(th0, file, 58, 12, 2054);
    			add_location(th1, file, 59, 12, 2082);
    			add_location(th2, file, 60, 12, 2110);
    			attr_dev(tr, "class", "table-header svelte-uvg8cz");
    			add_location(tr, file, 57, 8, 2016);
    			attr_dev(table, "class", "svelte-uvg8cz");
    			add_location(table, file, 56, 4, 2000);
    			attr_dev(div, "class", "scene-list svelte-uvg8cz");
    			add_location(div, file, 55, 0, 1971);
    			attr_dev(p1, "class", p1_class_value = "" + (null_to_empty(/*statusClass*/ ctx[1]) + " svelte-uvg8cz"));
    			add_location(p1, file, 75, 0, 2535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*sim3dServerUrl*/ ctx[3]);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t8);
    			append_dev(tr, th1);
    			append_dev(tr, t10);
    			append_dev(tr, th2);
    			append_dev(table, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			insert_dev(target, t13, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t14);
    			append_dev(p1, t15);
    			if (if_block) if_block.m(p1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sim3dServerUrl*/ 8 && input.value !== /*sim3dServerUrl*/ ctx[3]) {
    				set_input_value(input, /*sim3dServerUrl*/ ctx[3]);
    			}

    			if (dirty & /*scenes, downloadScene*/ 80) {
    				each_value = /*scenes*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*statusMessage*/ 1) set_data_dev(t14, /*statusMessage*/ ctx[0]);

    			if (/*lastScenePath*/ ctx[2] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(p1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*statusClass*/ 2 && p1_class_value !== (p1_class_value = "" + (null_to_empty(/*statusClass*/ ctx[1]) + " svelte-uvg8cz"))) {
    				attr_dev(p1, "class", p1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let dstSceneName = "test-scene";
    	let statusMessage = "";
    	let statusClass = "progress";
    	let lastScenePath = "";
    	let sim3dServerUrl = "http://172.23.118.181:5005";
    	let scenes = [];

    	const loadScenes = async () => {
    		try {
    			$$invalidate(0, statusMessage = "Obteniendo lista de escenas");
    			$$invalidate(1, statusClass = "progress");
    			const scenesList = await window.fsAPI.getAvailableScenes(sim3dServerUrl);
    			$$invalidate(4, scenes = scenesList.scenes);
    			$$invalidate(0, statusMessage = "");
    			$$invalidate(1, statusClass = "success");
    		} catch(err) {
    			$$invalidate(0, statusMessage = err.message);
    			$$invalidate(1, statusClass = "fail");
    		}
    	};

    	const downloadScene = async identifier => {
    		try {
    			$$invalidate(0, statusMessage = "Descargando escena");
    			$$invalidate(1, statusClass = "progress");

    			const sceneUrl = (sim3dServerUrl[sim3dServerUrl.length - 1] !== '/'
    			? sim3dServerUrl + '/'
    			: sim3dServerUrl) + `api/v1/bg2scene/${identifier}/scene.vitscnj`;

    			const sceneName = `scene-${identifier}`;
    			const scenePath = await window.fsAPI.downloadScene(sceneUrl, sceneName);
    			$$invalidate(1, statusClass = "success");
    			$$invalidate(0, statusMessage = `Escena descargada en la ruta ${scenePath}`);
    			$$invalidate(2, lastScenePath = scenePath);
    		} catch(err) {
    			$$invalidate(1, statusClass = "fail");
    			$$invalidate(0, statusMessage = "Error descargando la escena. Comprueba la URL del servidor");
    			console.error(err);
    		}
    	};

    	const openScenePath = () => {
    		window.fsAPI.revealInFileExplorer(lastScenePath);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		sim3dServerUrl = this.value;
    		$$invalidate(3, sim3dServerUrl);
    	}

    	const click_handler = async () => await loadScenes();
    	const click_handler_1 = async scene => await downloadScene(scene.id);
    	const click_handler_2 = () => openScenePath();

    	$$self.$capture_state = () => ({
    		dstSceneName,
    		statusMessage,
    		statusClass,
    		lastScenePath,
    		sim3dServerUrl,
    		scenes,
    		loadScenes,
    		downloadScene,
    		openScenePath
    	});

    	$$self.$inject_state = $$props => {
    		if ('dstSceneName' in $$props) dstSceneName = $$props.dstSceneName;
    		if ('statusMessage' in $$props) $$invalidate(0, statusMessage = $$props.statusMessage);
    		if ('statusClass' in $$props) $$invalidate(1, statusClass = $$props.statusClass);
    		if ('lastScenePath' in $$props) $$invalidate(2, lastScenePath = $$props.lastScenePath);
    		if ('sim3dServerUrl' in $$props) $$invalidate(3, sim3dServerUrl = $$props.sim3dServerUrl);
    		if ('scenes' in $$props) $$invalidate(4, scenes = $$props.scenes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		statusMessage,
    		statusClass,
    		lastScenePath,
    		sim3dServerUrl,
    		scenes,
    		loadScenes,
    		downloadScene,
    		openScenePath,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    new App({
        target: document.body
    });

})();
//# sourceMappingURL=renderer.js.map
