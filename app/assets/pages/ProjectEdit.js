import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';

function ProjectEdit() {
    const [id, setId] = useState(parseInt(useParams().id))
    const [isVisible, setIsVisible] = useState()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/api/project/${id}`)
            .then(function (response) {
                let project = response.data
                setName(project.name)
                setDescription(project.description)
                setIsVisible(project.isVisible)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occured',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/")
            })
    }, [])

    const toggleVisibility = () => {
      setIsVisible(!isVisible)
    }

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
        axios.patch(`/api/project/${id}`, {
            name: name,
            description: description,
            isVisible: !isVisible
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Project updated sucessfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
                navigate(`/show/${id}`)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occured',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
            });
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Edit Project</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right rounded-0"
                            to="/">View All Projects
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    onChange={(event)=>{setName(event.target.value)}}
                                    value={name}
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(event)=>{setDescription(event.target.value)}}
                                    className="form-control"
                                    id="description"
                                    rows="3"
                                    name="description"></textarea>
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-success rounded-0 mt-3">
                                Update Project
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProjectEdit;