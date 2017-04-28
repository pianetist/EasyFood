const http = require('http');
const fs = require('fs');

const port = 2500;

var taskExample = {
  header: 'Put the lid on the pot yo please!',
  estTime: '35',
  description: "ver since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  cleanUp: 'Good job! You can follow directions!',
  wait: {
    time: '5',
    cleanUp: 'good job waiting! time has passed!'
  }
};

var recipeExample = {
  title: 'testRecipe checking',
  estTime: '5:30',
  tasks: [
    taskExample, taskExample
  ]
}

var recipeHeaderExample = {
  title: 'testRecipe Checking',
  estTime: '5:30',
  difficulty: 'HARD',
  id: '0'
}

var recipeHeadersExample = {
  recipes: [recipeHeaderExample, recipeHeaderExample, recipeHeaderExample]
}

var recipes;

fs.readFile ('recipes.json', 'utf8', function (err, data) {
  if (err) {
    console.log (err);
  }
  recipes = JSON.parse(data);
});

var getRecipeHeaders = () => {
  return JSON.stringify(recipes.recipeHeaders);
}

var isNumber = (n) => {
  return !isNaN(n);
}

const requestHandler = (req, res) => {
  console.log(req.url);
  if (req.url === '/headers') {
    res.end(getRecipeHeaders ());
  } else if (req.url.indexOf('/recipe-id=') === 0) {
    var id = req.url.substring('/recipe-id='.length);
    if (isNumber(id)) {
      id = parseInt(id);
      console.log(id);
      var recipeList = recipes.recipes;
      var selectedRecipe;
      for (var i = 0; i < recipeList.length; i++) {
        if (recipeList[i]['id'] == id) {
          selectedRecipe = recipeList[i];
        }
      }

      res.end(JSON.stringify(selectedRecipe));
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('No such recipe');
    }
  }
}

const server = http.createServer (requestHandler);

server.listen (port, (err) => {
  if (err) {
    return console.log ('Error while setting up server', err);
  }

  console.log('Listening on port ' + port);
});