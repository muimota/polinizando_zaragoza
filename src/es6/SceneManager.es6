class SceneManager{

  constructor(stage){
    this.stage = stage;
    this.scenes = {};
    this.currentScene = null;

  }
  addScene(name,scene){
    this.scenes[name] = scene;
  }
  gotoScene(name){
    if(this.currentScene != null){
      this.stage.removeChild(this.currentScene);
      createjs.Ticker.removeEventListener('tick',this.tickHandler.bind(this));
    }else{
      createjs.Ticker.addEventListener('tick',this.tickHandler.bind(this));
    }
    this.currentScene = this.scenes[name];
    this.stage.addChild(this.currentScene);
  }
  tickHandler(event){
    this.currentScene.update(event);
    this.stage.update();
  }

}

export {SceneManager};
