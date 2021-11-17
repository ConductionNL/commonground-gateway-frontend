import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { useEffect, useState } from "react";
import { Link } from "gatsby"

export default function ObjectEntityForm({ id }) {
  const context = useUrlContext();
  const [objectEntity, setObjectEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getObjectEntity = () => {
    fetch(context.apiUrl + "/object_entities/" + id, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        setObjectEntity(data);
      });
  }

  const checkInputs = (inputs) => {
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].length === 0) {
        valid = false;
      }
    }

    return valid;
  }

  const removeEmptyValues = (obj) => {
    for (var propName in obj) {
      if ((obj[propName] === undefined || obj[propName] === '') && obj[propName] !== false) {
        delete obj[propName];
      }
    }
    return obj
  }

  const saveObjectEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body = {
      uri: event.target.uri.value,
      application: event.target.application.value ? event.target.application.value : null,
      organization: event.target.organization.value ? event.target.organization.value : null,
      owner: event.target.owner.value ? event.target.owner.value : null,
      objectValues: event.target.objectValues.value ? event.target.objectValues.value : null,
    }

    // This removes empty values from the body
    body = removeEmptyValues(body);

    if (!checkInputs([body.name])) {
      return;
    }

    let url = context.apiUrl + '/entities';
    let method = null;
    if (id === 'new') {
      method = 'POST';
    } else {
      url = url + '/' + id;
      method = 'PUT';
    }


    fetch(url, {
      method: method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved entity:', data);
        setObjectEntity(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id !== "new") {
      getObjectEntity();
    }
  }, []);

  return (
    <div className="utrecht-card card">
      <form id="dataForm" onSubmit={saveObjectEntity} >

        <div className="utrecht-card-header card-header">
          <div className="utrecht-card-head-row card-head-row row">
            <div className="col-6">
              <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Values</h4>
            </div>
            <div className="col-6 text-right">
              <Link className="utrecht-link" to="/entities">
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"><i className="fas fa-long-arrow-alt-left mr-2"></i>Back</button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit"><i className="fas fa-save mr-2"></i>Save</button>
            </div>
          </div>
        </div>
        <div className="utrecht-card-body card-body">
          <div className="row">
            <div className="col-12">
              {
                showSpinner === true ?
                  <div className="text-center py-5">
                    <div class="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div> :
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label mb-2">Uri *</span>
                          {
                            objectEntity !== null && objectEntity.uri !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="uri" id="uriInput" defaultValue={objectEntity.uri} required /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="uri" id="uriInput" required />
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Application</span>
                          {
                            objectEntity !== null && objectEntity.application !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="application" id="applicationInput" defaultValue={objectEntity.application} /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="application" id="applicationInput" />
                          }
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Organization</span>
                          {
                            objectEntity !== null && objectEntity.organization !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="organization" id="organizationInput" defaultValue={objectEntity.organization} /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="organization" id="organizationInput" />
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Owner</span>
                          {
                            objectEntity !== null && objectEntity.owner !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="owner" id="ownerInput" defaultValue={objectEntity.owner} /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="owner" id="ownerInput" />
                          }
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Object values</span>
                          {
                            objectEntity !== null && objectEntity.objectValues !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="objectValues" id="objectValuesInput" defaultValue={objectEntity.objectValues} /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="objectValues" id="objectValuesInput" />
                          }
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </form>


    </div>
  );
}