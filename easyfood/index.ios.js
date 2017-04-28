/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View, Alert, Button, AlertIOS, Animated, Easing, Dimensions, ScrollView, TimerMixin, TouchableOpacity } from 'react-native';

var taskExample = {
  header: 'Put the lid on the pot yo',
  estTime: '35',
  description: "ver since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  cleanUp: 'Good job! You can follow directions!',
  wait: {
    time: '5',
    cleanUp: 'good job waiting! time has passed!'
  }
};

var recipeExample = {
  title: 'testRecipe',
  estTime: '5:30',
  tasks: [
    taskExample, taskExample
  ]
}

var recipeHeaderExample = {
  title: 'testRecipe',
  estTime: '5:30',
  difficulty: 'HARD',
  id: '0'
}

var recipeHeadersExample = {
  recipes: [recipeHeaderExample, recipeHeaderExample, recipeHeaderExample]
}

class TaskHeader extends Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <View style={{height: 42, backgroundColor: 'skyblue'}}>
        <Text style={{textAlign: 'center', paddingTop: 12, fontWeight: 'bold'}}>
          {this.props.taskData['header']}
        </Text>
      </View>
    );
  }
}

class TaskBody extends Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <View style={{}}>
        <Text style={{textAlign: 'left', padding: 12}}>
          {this.props.taskData['description']}
        </Text>
      </View>
    );
  }
}



class TaskBottom extends Component {
  constructor (props) {
    super (props);
  }

  buttonPress () {
    AlertIOS.alert (
      this.props.taskData.cleanUp,
      null,
      this.props.onComplete
    );
  }

  render () {
    return (
      <Button
        onPress={()=>this.buttonPress()} 
        title="Done!"
      />
    );
  }
}

class Task extends Component {
  constructor (props) {
    super(props);
    this.state = {
      yPosAnim: new Animated.Value (50),
    };
  }

  render () {
    return (
      <View style={{height: this.props.taskHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: 300, backgroundColor: 'powderblue', borderRadius: 10}}>
          <TaskHeader taskData={this.props.taskData} />
          <TaskBody taskData={this.props.taskData} />
          <TaskBottom taskData={this.props.taskData} onComplete={() => this.props.onComplete()}/>
        </View>
      </View>
    );
  }
}

class DummyTask extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={{height: this.props.taskHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: 300, backgroundColor: 'powderblue', borderRadius: 10}}>
          <Text>No more tasks left! Please wait for the timers to finish!</Text>
        </View>
      </View>
    );
  }
}

class TaskTimer extends Component {
  constructor (props) {
    super (props);
    this.state = {
      timeLeft: parseInt(this.props.taskData['wait']['time'])
    };
  }

  componentDidMount () {
    this.timerID = setInterval ( () => {
      this.tick()
    }, 1000);
  }

  alertTimersContainer () {
    this.props.onTimerComplete(this.props.taskID);
  }

  tick () {
    var newTime = this.state.timeLeft - 1;

    this.setState ({
      timeLeft: newTime
    });

    // check if timer finished
    if (newTime == 0) {
      clearInterval (this.timerID);
      AlertIOS.alert (
        this.props.taskData['wait']['cleanUp'],
        null,
        this.alertTimersContainer.bind(this)
      );
      //Alert.alert(this.props.taskData.wait.cleanUp);
      //this.props.onTimerComplete(this.props.taskID);
      return;
    }
  }

  componentWillUnmount () {
  }

  formatTime () {
    var min = Math.floor(this.state.timeLeft / 60);
    var sec = this.state.timeLeft % 60;
    if (sec >= 10) {
      return min + ":" + sec;
    } else {
      return min + ":0" + sec;
    }
  }

  render () {
    return (
      <View style={{height: 40, width: this.props.containerWidth, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#C5C1AA'}}>
        <View style={{flex: 8}}>
          <Text style={{padding: 10, paddingLeft: 20}}>{this.props.taskData['header']}</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={{padding: 10}}>{this.formatTime()}</Text>
        </View>
      </View>
    );
  }
}

class TaskTimersContainer extends Component {
  constructor (props) {
    super (props);
    this.state = {
      activeTaskTimers: [],
    }
  }

  addTaskTimer (taskID) {
    var activeTaskTimers = this.state.activeTaskTimers;
    activeTaskTimers.push(taskID);
    this.setState ({
      activeTaskTimers: activeTaskTimers
    });
  }

  timerComplete (taskID) {
    // remove specified timer
    var activeTaskTimers = this.state.activeTaskTimers;
    var idx = activeTaskTimers.indexOf(taskID);
    if (idx >= 0) {
      activeTaskTimers.splice(idx, 1);
      this.setState ({
        activeTaskTimers: activeTaskTimers
      });
    }

    // notify parent to check if recipe is done
    this.props.onTimerComplete();
  }

  getRemainingTimers () {
    return this.state.activeTaskTimers.length;
  }

  render () {
    return (
      <View style={{height: this.props.containerHeight, width: this.props.containerWidth}}>
        <View style={{width: this.props.containerWidth, height: 60, borderBottomWidth: 1, borderStyle: 'solid', marginTop: 30}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20, padding: 10}}>
            Current Tasks
          </Text>
        </View>
        {this.state.activeTaskTimers.map(function (val, idx) {
          return (
            <TaskTimer containerWidth={this.props.containerWidth} taskData={this.props.tasks[val]} key={val} taskID={val} onTimerComplete={(taskID) => {this.timerComplete(taskID)}} />
          );
        }, this)}
      </View>
    );
  }
}

class TasksContainer extends Component {
  constructor (props) {
    super (props);
    let {width, height} = Dimensions.get('window');
    this.height = height;
    this.width = width;
    this.state = {
      tasks: [],
      yPosAnim: new Animated.Value (0),
      currentTask: 0
    }
  }

  componentDidMount () {
    //make ajax call here
    var req = new XMLHttpRequest ();
    req.onreadystatechange = (e) => {
      if (req.readyState !== 4) {
        return;
      }

      if (req.status === 200) {
        console.log('success', req.responseText);
        var recipe = JSON.parse(req.responseText);
        this.setState({
          tasks: recipe['tasks']
        });
      } else {
        AlertIOS.alert (
          "Cannot load data."
        );
        console.warn('error');
      }
    };

    req.open('GET', "http://165.123.219.138:2500/recipe-id=" + this.props.recipeID);
    req.send();
    /*
    this.setState({
      tasks: recipeExample.tasks
    });
    */
  }

  timerCompleted () {
    if (this.isFinished()) {
      alert("You're done! Enjoy your food!");
      this.props.recipeFinished();
    }
  }

  taskCompleted () {
    // start timer for task if necessary
    if (this.state.tasks[this.state.currentTask].wait) {
      this.taskTimersContainer.addTaskTimer(this.state.currentTask);
    }

    // change current state
    var newTask = this.state.currentTask + 1;
    this.setState ({
      currentTask: newTask
    });

    // handle scrolling animation
    Animated.timing (
      this.state.yPosAnim,
      {
        toValue: -this.state.currentTask * this.height,
        duration: 500,
      }
    ).start();

    if (this.isFinished()) {
      alert("You're done! Enjoy your food!");
      this.props.recipeFinished();
    }
  }

  isFinished () {
    var timersLeft = this.taskTimersContainer.getRemainingTimers();
    var currentTask = this.state.currentTask;

    return (currentTask == this.state.tasks.length && timersLeft == 0);
  }

  render () {
    return (
      <ScrollView horizontal={true}>
        <Animated.View style={{
          height: (this.state.tasks.length+1) * this.height,
          width: this.width,
          flexDirection: 'column',
          alignItems: 'center',
          top: this.state.yPosAnim
        }}>
          {this.state.tasks.map(function (val, idx) {
            return <Task taskData={val} key={idx} onComplete={() => this.taskCompleted()} taskHeight={this.height} />
          }, this)}
          <DummyTask taskHeight={this.height} />
        </Animated.View>
        <TaskTimersContainer containerHeight={this.height} onTimerComplete={() => this.timerCompleted ()} containerWidth={this.width} tasks={this.state.tasks} ref={(taskTimersContainer) => {this.taskTimersContainer = taskTimersContainer}}/>
      </ScrollView>
    );
  }
}

class RecipeHeader extends Component {
  constructor (props) {
    super (props);
  }

  componentDidMount () {
  }

  headerClicked () {
    this.props.onHeaderClick(this.props.headerID);
  }

  render () {
    return (
      <TouchableOpacity onPress={() => this.headerClicked()}>
      <View style={{height: 40, width: this.props.containerWidth, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#C5C1AA'}}>
        <View style={{flex: 8}}>
          <Text style={{padding: 10, paddingLeft: 20}}>{this.props.headerData['title']}</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={{padding: 10}}>{this.props.headerData['difficulty']}</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={{padding: 10}}>{this.props.headerData['estTime']}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }
}

class RecipeHeadersContainer extends Component {
  constructor (props) {
    super (props);
    this.state = {
      recipeHeaders: [],
    }
  }

  componentDidMount () {
    //make ajax call here
    var req = new XMLHttpRequest ();
    req.onreadystatechange = (e) => {
      if (req.readyState !== 4) {
        return;
      }

      if (req.status === 200) {
        console.log('success', req.responseText);
        var recipeHeaders = JSON.parse(req.responseText);
        this.setState({
          recipeHeaders: recipeHeaders
        });
      } else {
        AlertIOS.alert (
          "Cannot load data."
        );
        console.warn('error');
      }
    };

    req.open('GET', "http://165.123.219.138:2500/headers");
    req.send();
    /*
    this.setState({
      recipeHeaders: recipeHeadersExample.recipes
    });
    */
  }

  recipeClicked (headerID) {
    this.props.onRecipeClicked(headerID);
  }

  render () {
    return (
      <View style={{height: this.props.containerHeight, width: this.props.containerWidth}}>
        <View style={{width: this.props.containerWidth, height: 60, borderBottomWidth: 1, borderStyle: 'solid', marginTop: 30}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20, padding: 10}}>
            Recipes
          </Text>
        </View>
        {this.state.recipeHeaders.map(function (val, idx) {
          return (
            <RecipeHeader containerWidth={this.props.containerWidth} headerData={val} key={idx} headerID={val['id']} onHeaderClick={(headerID) => this.recipeClicked(headerID)}/>
          );
        }, this)}
      </View>
    );
  }
}

class AppContainer extends Component {
  constructor (props) {
    super(props);
    let {width, height} = Dimensions.get('window');
    this.height = height;
    this.width = width;
    this.state = {
      recipeClicked: -1
    }
  }

  recipeClicked (recipeID) {
    this.setState ({
      recipeClicked: recipeID
    });
    this.scrollView.scrollTo ({x: this.width, y: 0, animated: true});
  }

  recipeFinished () {
    //this.scrollView.scrollTo ({x: 0, y: 0, animated: true});
    this.setState({
      recipeClicked: -1
    })
  }

  getRecipeTasks () {
    if (this.state.recipeClicked >= 0) {
      return (
        <TasksContainer recipeID={this.state.recipeClicked} recipeFinished={() => this.recipeFinished()} />
      );
    } else {
      return;
    }
  }

  render () {
    return (
      <ScrollView horizontal={true} pagingEnabled={true} ref={(scrollView) => {this.scrollView = scrollView}}>
        <RecipeHeadersContainer containerHeight={this.height} containerWidth={this.width} onRecipeClicked={(headerID) => this.recipeClicked(headerID)}/>
        {this.getRecipeTasks()}
      </ScrollView>
    );
  }
}

AppRegistry.registerComponent('EasyFood', () => AppContainer);