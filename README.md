# Readme

## Debug

Place the `environments` folder in this directory, containing the file `environments.json` and the Unreal environments like this:

```sh
[this-repo]
  |-environments
    |-Env1
    | |- Env1.exe
    | |- ...
    |-Env2
    | |- Env2.exe
    | |- ...
    |-environments.json
```

**environments.json**

```js
[
    {
        "name": "Env1"
    },
    {
        "name": "Env2"
    }
]
```

## Production

Run `npm run make` to generate the application at `out` directory. After that, place the `environments` folder described above in the same directory as the application executable:

```sh
[this-repo]
 |-out
   |- bg2e-scene-download-win32-x64
     |-bg2-scene-download.exe
     |- ...
     |- environments
        |-Env1
        | |- Env1.exe
        | |- ...
        |-Env2
        | |- Env2.exe
        | |- ...
        |-environments.json
```