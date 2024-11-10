import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupView from './GroupView'; // Ensure this is the correct import path

function App() {
  return (
    <Router>
      <Routes>
        {/* Add a route for the root if needed */}
        <Route path="/" element={<div>Welcome to the Home Page</div>} />
        {/* Route for group view */}
        <Route path="/:groupName" element={<GroupView />} />
      </Routes>
    </Router>
  );
}

export default App;
