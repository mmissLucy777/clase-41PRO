class Game {
  constructor(){

  } 

  getState(){ //Función para obtener el estado del juego
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){ //Función para actualizar el estado del juego
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){ //Función asíncrona para iniciar el juego
    if(gameState === 0){
      player = new Player(); //Crea nuevo objeto de la clase Player
      var playerCountRef = await database.ref('playerCount').once("value"); //Espera la referencia y valor de la base de datos  y lo asigna al contador del player
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form() //Crea un nuevo objeto de la clase Form
      form.display();
    }
    //Crea los sprites de los autos y agrega las imagenes
    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car3 = createSprite(500,200);
    car3.addImage("car3",car3_img);
    car4 = createSprite(700,200);
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide(); //oculta el formulario
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)

       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance > 3860){
      gameState = 2;
      player.rank +=1 //** Actualizar en ranking del jugador */
      Player.updateCarsAtEnd(player.rank)
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);  //**Muestra la clasificación del jugador cuando termina el juego */
  }
}
