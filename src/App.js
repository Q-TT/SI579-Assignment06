import { useState } from 'react';
import { Container, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function getSynonyms(ml, callback) {
  fetch(`https://api.datamuse.com/words?${(new URLSearchParams({ml})).toString()}`)
      .then((response) => response.json())
      .then((data) => {
          callback(data);
      }, (err) => {
          console.error(err);
      });
}

function groupBy(objects, property) {
  if(typeof property !== 'function') {
      const propName = property;
      property = (obj) => obj[propName];
  }
  
function getRhymes(rel_rhy, callback) {
  fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
      .then((response) => response.json())
      .then((data) => {
          callback(data);
      }, (err) => {
          console.error(err);
      });
}

  const groupedObjects = new Map(); 
  for(const object of objects) {
      const groupName = property(object);
      //Make sure that the group exists
      if(!groupedObjects.has(groupName)) {
          groupedObjects.set(groupName, []);
      }
      groupedObjects.get(groupName).push(object);
  }

  const result = {};
  for(const key of Array.from(groupedObjects.keys()).sort()) {
      result[key] = groupedObjects.get(key);
  }
  return result;
}

function addS(num) {
  return num === 1 ? '' : 's';
}

function WordItem(props) {
  const {text} = props;
  function saveWord() {
    if(props.onSave) {
      props.onSave();
    }
  }
  return <li>{text}<Button variant="outline-success" onClick={saveWord}>Save</Button></li>;
}

function GroupItem(props) {
  const {group, idx, toPass} = props;
  const wordDisplay = group.map((item, index) => <WordItem text={item.word} key={index} onSave={() => toPass(item.word)} />);
  return <><h3>{`${idx} syllable${addS(parseInt(idx))}:`}</h3><ul>{wordDisplay}</ul></>;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [description, setDescription] = useState('');
  const [savedWords, setSavedWords] = useState('(none)');
  const [wordOutput, setWordOutput] = useState('');
  const [savedList, setSavedList] = useState([]);

  const showRhymes = () => {
    setDescription(`Words that rhyme with ${inputText}`);
    setWordOutput('...loading');
    getRhymes(inputText, (data) => {
      if(data.length) {
        const groups = groupBy(data, 'numSyllables');
        const elements = [];
        for(const key in groups){  
          elements.push(<GroupItem group={groups[key]} key={key} idx={key} toPass={handleSave}/>);
        }
        setWordOutput(elements);
      }
      else{
        setWordOutput('(no results)');
      }
    });
  };

  const showSynonyms = () => {
    setDescription(`Words with a meaning similar to ${inputText}`);
    setWordOutput('...loading');
    getSynonyms(inputText, (data) => {
      if(data.length) {
        setWordOutput(data.map((item, index) => <WordItem text={item.word} key={index} onSave={() => handleSave(item.word)} />));
      }
      else{
        setWordOutput('(no results)');
      }
    });
  };

  const handleSave = (word) => {
    let saved = savedList;
    if(!saved.includes(word)) {
        saved.push(word);
        setSavedList(saved);
        setSavedWords(saved.join(', '));
    }
  };

  const handleChange = (event) => {
    setInputText(event.target.value);
  };
  
  return (
    <div className="App">
      <div>
        <h1 className="row">Rhyme Finder (579 Problem Set 6)</h1>
        <div className="row">
          <div className="col">Saved words: <span id="saved_words">{savedWords.join(", ")}</span> </div>
        </div>
        <div className="row"> <div className="input-group col">
            <input
              className="form-control"
              type="text"
              placeholder="Enter a word"
              value={input}
              onChange={(e) => { setInput(e.target.value);}}
              onKeyDown={handleKeyDown}
            />
            <button
              id="show_rhymes"
              type="button"
              className="btn btn-primary"
              onClick={handleRhymesClick}
            >
              Show rhyming words
            </button>
            <button
              id="show_synonyms"
              type="button"
              className="btn btn-secondary"
              onClick={handleSynonymsClick}
            >
              Show synonyms
            </button>
          </div>
        </div>
        <div className="row">
          <h1 className="col" id="output_description">
            {displayName}
          </h1>
        </div>
        <div className="output row">
          <output id="word_output" className="col">
            {displayList}
          </output>
        </div>
        <div> <a href={"https://github.com/Q-TT/SI579-Assignment06"}>https://github.com/Q-TT/SI579-Assignment06</a> </div>
      </div>
    </div>
  );
}
        

export default App;
