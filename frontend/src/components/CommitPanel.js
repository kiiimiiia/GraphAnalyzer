import React from 'react';

const CommitPanel = ({ firstCommitDate, lastCommitDate }) => {
  return (
    <div>
      {/* <h2>Commit Dates</h2> */}
      <p>First Commit Date: {firstCommitDate} Last Commit Date: {lastCommitDate}</p>
    </div>
  );
}

export default CommitPanel;
