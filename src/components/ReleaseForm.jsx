import React from "react";
import useForm from "react-hook-form";

const repositoryErrorMessage = "Repository url is required";
const currentVersionErrorMessage =
  "You must provide the version you're currently using";

const errorMessage = message => <p className="help is-danger">{message}</p>;

const ReleaseForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
  };

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
          <label htmlFor="currentVersion" className="label">
            My Version (Tag)
          </label>
          <div className="control">
            <input
              id="currentVersion"
              name="currentVersion"
              className="input"
              placeholder="v1.0.0"
              ref={register({ required: true, maxLength: 100 })}
            />
          </div>
          {errors.currentVersion && errorMessage(currentVersionErrorMessage)}
        </div>

        <div className="field column">
          <label htmlFor="compareVersion" className="label">
            Compare version (Optional)
          </label>
          <div className="control">
            <input
              id="compareVersion"
              name="compareVersion"
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
