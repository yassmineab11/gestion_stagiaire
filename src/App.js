// App.js
import React from 'react';
import ListeStagiairesParGroupe from './stagiaire/ListeStagiairesParGroupe';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <ListeStagiairesParGroupe /> {/* Vous pouvez ajouter groupId comme prop si nécessaire */}
    </div>
  );
}

export default App;
