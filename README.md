# Circles Box

This application was created with the main objective of providing entertainment and at the same time serving as a valuable tool to expand knowledge about the P5.js library. Designed by me, thinking of you, have fun.

## How to use?

In the foreground, Circles Box was made to WEB uses. Therefore, has HTML, CSS and JavaScript support by default on your favorite browser. So, if you wanna play without install dependencies or source code, you can try on [web site](<http://circlesbox.vercel.app>).

If you wanna edit the source code or play directly in localhost mode, you should clone this repository with the following git bash command line:

```git clone https://github.com/vitorluuiz/P5.js.git```

After running this command, CircleBox will be installed and finally, you can create a self hosted server to provide a localhost acess to file project.

Just use the prompt ``npm start`` into the root of project, then, a server will be started in port ``3000`` by default, or a next port that will be free.

Maybe you want to do this if you are a developer or wanna know how animations in P5.js seens.

### Dependencies

To execute this process, you need to certify if ``git bash`` has installed on PC before install the project, in addition, if ``Node.js`` is installed too.

Git bash is a tool that you will use to install a copy from this repository stored into [Github](<https://github.com>). Node.js is a runtime/package manager/toolkit, that, in this context is used to deploy a server to serve all files from project to web browser.

## Patch Notes

### CirclesBox 1.0.4x

- Fix Vercel Deploy.

### CirclesBox 1.0.4

- Setup bugs fix.
- Server web included to serve game client files.

### CirclesBox 1.0.3

- Add WEB GUI.
- Enable/Disable game sounds
- Modify game settings.

### CirclesBox 1.0.2

- Fix circles collisions detection.
- New users pointers in game.
- Add Pointers collision detect.
- Add restart new game with mouse click.
- Circle speed increases with game time.
- Add game points primitive system.
- Add Gameplay Music.

### CirclesBox 1.0.1

- New method to detect circle collisions, now only truly unknown collisions are tested.
- Better usage of Object-oriented programming.
- Wall collisions are now more stable, with a lower error rate.
- Initial X, Y position doesn't match with others circles in canvas. Preventing double spawn in the same space.
