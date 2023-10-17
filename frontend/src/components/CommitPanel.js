import React from 'react';

const CommitPanel = ({ firstCommitDate, lastCommitDate }) => {
  return (
    <div style={{ textAlign: 'center', margin: 'auto', width: '50%' }}>
      <h2>Please Select time period between:</h2>
      <p>First Commit Date: {firstCommitDate} and  Last Commit Date: {lastCommitDate}</p>
    </div>
  );
}

export default CommitPanel;
