import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { AppStateContext } from "../contexts/AppStateContext";
import useGithubReleasesWithBreakingChanges from "../hooks/useGithubReleasesWithBreakingChanges";

const ReleaseRow = ({ release }) => {
  return (
    <tr>
      <td>
        <a href={release.url}>{release.tagName}</a>
      </td>
      <td>{release.createdAt}</td>
      <td>
        <ReactMarkdown source={release.breakingChanges} />
      </td>
    </tr>
  );
};

const BreakingChangesList = () => {
  const { state: appState } = useContext(AppStateContext);
  const { repository, minorVersion, majorVersion } = appState.request
    ? appState.request
    : {};
  const { releases, loading, error } = useGithubReleasesWithBreakingChanges({
    pageSize: 25,
    repository,
    between: { majorVersion, minorVersion }
  });

  if (!repository) {
    return null;
  }

  if (loading) {
    return "Loading...";
  }

  if (error) {
    console.log(error);
    return error.message;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Tag</th>
          <th>Created</th>
          <th>Breaking Changes</th>
        </tr>
      </thead>

      <tbody>
        {releases.map(release => (
          <ReleaseRow key={release.tagName} release={release} />
        ))}
      </tbody>
    </table>
  );
};

export default BreakingChangesList;
