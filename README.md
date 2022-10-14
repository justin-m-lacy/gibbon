# Gibbon

## Note
This is a simple pixi.js Game Engine Framework to help make games quickly with pixi.js

It uses an object/component system (Not ECS) similar to Unity.

The project is in development and I update it as I toy with it. I added to npm for my own ease of use.

## Using

### Extend Game

Optionally override constructor and init() function.

```import { Game } from 'gibbon.js';

export class MyGame extends Game {

    constructor(app:Application){
        super(app);
    }

    override init(){

        super.init();
        /// this.start() could be called here.

        /// Create and add Actor objects...
        /// Add components to Actor objects...
    }

}
```


### Init Pixi App and start game.

```

import {Application} from 'pixi.js';
import { MyGame } from './my-game';


const app = new Application({

    width: window.innerWidth,
    height: window.innerHeight,
    sharedLoader: true,
    antialias: true,
    resizeTo: window,
    backgroundColor: 0xaaccff

});

document.body.appendChild(app.view);
const game = new MyGame(app);
game.init();
game.start();
```


## Development


### Actors and Components

While it is possible to subclass Actors, it is better to subclass Components
and add them to actors.
