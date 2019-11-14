import React, { useContext, useCallback } from "react";
import useForm from "react-hook-form";
import { AppStateContext } from "../contexts/AppStateContext";

const repositoryErrorMessage = "Repository url is required";
const minorVersionErrorMessage =
  "You must provide the version you're currently using";

const errorMessage = message => <p className="help is-danger">{message}</p>;

const ReleaseForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const { setState: setAppState } = useContext(AppStateContext);

  const onSubmit = useCallback(
    formData => {
      setAppState({ request: formData });
    },
    [setAppState]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="repository" className="label">
          Repository
        </label>
        <div className="control">
          <input
            id="repository"
            name="repository"
            className="input"
            placeholder="octocat/Hello-World"
            ref={register({ required: true, maxLength: 100 })}
          />
        </div>
        {errors.repository && errorMessage(repositoryErrorMessage)}
      </div>

      <div className="columns">
        <div className="field column">
          <label htmlFor="minorVersion" className="label">
            Minor Version (Tag)
          </label>
          <div className="control">
            <input
              id="minorVersion"
              name="minorVersion"
              className="input"
              placeholder="v1.0.0"
              ref={register({ required: true, maxLength: 100 })}
            />
          </div>
          {errors.minorVersion && errorMessage(minorVersionErrorMessage)}
        </div>

        <div className="field column">
          <label htmlFor="majorVersion" className="label">
            Major version (Optional)
          </label>
          <div className="control">
            <input
              id="majorVersion"
              name="majorVersion"
              className="input"
              placeholder="(Default is latest)"
              ref={register({ maxLength: 100 })}
            />
          </div>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <input className="button is-fullwidth is-primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default ReleaseForm;
