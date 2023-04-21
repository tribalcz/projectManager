import React, {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';

function ProjectCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleSave = () => {
        //Validace polí name a description
        if (!name || !description) {
            Swal.fire({
                icon: 'error',
                title: 'Please fill in all fields!',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }
        setIsSaving(true);
        let formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        axios.post('/api/project', formData)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Project saved successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setName('')
                setDescription('')
                navigate("/");
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occured!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
            });
    }

    return(
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Create New Project</h2>
                <div className="card">
                    <div className="card-header">
                        <Link className="btn btn-outline-info float-right rounded-0" to="/" >
                            View All Projects
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input onChange={(event) => {setName(event.target.value)}}
                                       value={name} type="text" className="form-control" id="name" name="name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea onChange={(event) => {setDescription(event.target.value)}}
                                          value={description} type="text" className="form-control" id="description" name="description">
                                </textarea>
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-primary rounded-0 mt-3">
                                Save Project
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProjectCreate;