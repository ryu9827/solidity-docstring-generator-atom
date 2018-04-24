'use babel';

import { CompositeDisposable } from 'atom';

export default {
  editor: null,
  words: null,
  textBuffer: null,


  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'docstring-generator-solidity:toggle': () => this.run()
    }));
  },

run() {
  typeOfDocstring = {
  pragma :
      '/** \n'
  +  ' * Created on: \n'
  +  ' * @summary: \n'
  +  ' * @author: \n'
  +  ' */ \n'
,
  contract :
    '/** \n'
+  ' * @title: \n'
+  ' */ \n'
}

  this.reload();

  for (var i = 0; i < this.words.length; i++) {
    // console.log('i = ' + i);
    let result = this.lookForString(this.words[i]);
    console.log('result = ' + this.lookForString(this.words[i]));
    if (result != null  && !this.hasDocstring(this.words[i-1])) {
        if (result == 'function'){
          typeOfDocstring.function = this.generateFuncDocstring(this.words[i]);
        }
        this.textBuffer.insert( [i, 0], typeOfDocstring[result] );
        i += 3
        this.reload();
    }
  };
},

generateFuncDocstring(line){
  let inputs = '';            //To set docstring about inputs params
  let returns = (line.indexOf('returns')>=0)?  ' * @return : \n' : '' ; //To set docstring about returned variable
  let functionDocstring;
  line = line.substring(line.indexOf('(')+1, line.indexOf(')') );
  params = line.split(',');
  for (var i = 0; i < params.length; i++) { //to generate inputs string
    console.log('params type = ' + params[i].split(' ')[0]);
    inputs += ' * @param ' +  this.trim(params[i]).split(' ')[0] + ' ' + this.trim(params[i]).split(' ')[1] + ' : ' + ' \n';
  }
  return  functionDocstring =
  '/** \n'
  +  ' * @dev: \n'
  + inputs
  + returns
  +  ' */ \n';
},

reload() {
  this.editor = atom.workspace.getActiveTextEditor();
  this.textBuffer = this.editor.getBuffer();
  this.words = this.editor.getText().split('\n');
},

hasDocstring(line){
  if (typeof line == 'undefined'){ return false;}
  return line.indexOf('*/')>=0
},

lookForString(line) {
  line = this.trim(line);
  if(line.indexOf('pragma ') >= 0){
    return 'pragma';
  }else if(line.indexOf('contract ') >= 0){
    return 'contract';
  }else if(line.indexOf('function ') >= 0){
    return  'function';
  }else {
    return null;
  }
},

trim(str)
   {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

};
