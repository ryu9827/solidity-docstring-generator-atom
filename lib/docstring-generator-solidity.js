'use babel';

// import DocstringGeneratorSolidityView from './docstring-generator-solidity-view';
import { CompositeDisposable } from 'atom';

export default {

  // docstringGeneratorSolidityView: null,
  // modalPanel: null,
  // subscriptions: null,
  editor: null,
  words: null,
  textBuffer: null,


  activate(state) {

    // this.docstringGeneratorSolidityView = new DocstringGeneratorSolidityView(state.docstringGeneratorSolidityViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.docstringGeneratorSolidityView.getElement(),
    //   visible: false
    // });

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
// ,
//   function :
//     '/** \n'
// +  ' * @dev: \n'
// +  ' * @param _name \n'
// +  ' * @return _name \n'
// +  ' */ \n'
}

  this.reset();

  for (var i = 0; i < this.words.length; i++) {
    // console.log('i = ' + i);
    // let ret = this.lookForString(this.words[i], i);
    // if (ret.keyword != null  && !this.hasDocstring(this.words[i-1])) {
    //     this.textBuffer.insert([i, 0], docstrings[ret.keyword].text);
    //     i += docstrings[ret.keyword].length
    //     this.reset();
    // }
    if (this.lookForString(this.words[i], i) == 'pragma' && !this.hasDocstring(this.words[i-1]) ){
      this.textBuffer.insert([i, 0], typeOfDocstring.pragma);
      i = i + 5;
      this.reset();
    }else if (this.lookForString(this.words[i], i) == 'contract' && !this.hasDocstring(this.words[i-1]) ) {
      this.textBuffer.insert([i,0], typeOfDocstring.contract);
      i = i +3;
      this.reset();
    }else if (this.lookForString(this.words[i], i) == 'function' && !this.hasDocstring(this.words[i-1]) ) {
      console.log('returned string is : ' + this.generateFuncDocstring(this.words[i]));
      typeOfDocstring.function = this.generateFuncDocstring(this.words[i]);
      this.textBuffer.insert([i,0], typeOfDocstring.function);
      i = i +3;
      this.reset();
    }
  };
},

generateFuncDocstring(line){
  let inputs = '';            //inputs string
  let returns = (line.indexOf('returns')>=0)?  ' * @return : \n' : '' ;//returns string
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

reset() {
  this.editor = atom.workspace.getActiveTextEditor();
  this.textBuffer = this.editor.getBuffer();
  this.words = this.editor.getText().split('\n');
  // console.log('the first line of the file = ' + this.words[0]);
},

hasDocstring(line){
  if (typeof line == 'undefined'){ return false;}
    // console.log('current line is = ' + line);
    // console.log('print hasDocstring indexOf result: ' + line.indexOf('*/'));
  return line.indexOf('*/')>=0
},

lookForString(line, currentLine) {
  line = this.trim(line);
  if(line.indexOf('pragma ') >= 0){
    // console.log('pragm detected, at line:' + currentLine);
    return 'pragma';
  }else if(line.indexOf('contract ') >= 0){
    // console.log('contract detected, at line:' + currentLine);
    return 'contract';
  }else if(line.indexOf('function ') >= 0){
    // console.log('function detected, at line:' + currentLine);
    return  'function';
  }else {
    return null;
  }
},


trim(str)
   {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  deactivate() {
    // this.modalPanel.destroy();
    // this.subscriptions.dispose();
    // this.docstringGeneratorSolidityView.destroy();
  },

  serialize() {
    // return {
    //   docstringGeneratorSolidityViewState: this.docstringGeneratorSolidityView.serialize()
    // };
  },

  toggle() {
    // console.log('DocstringGeneratorSolidity was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
