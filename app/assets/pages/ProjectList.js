import React,{ useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxArchive,
    faEdit,
    faEye,
    faRotateLeft,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import '../css/loader.css';

function ProjectList() {
    const  [projectList, setProjectList] = useState([])
    const  [showDeleted, setShowDeleted] = useState(false)
    const  [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchProjectList()
    }, [showDeleted])

    const fetchProjectList = () => {
        setIsLoading(true)
        axios.get('/api/project', {
            params: {
                showDeleted: showDeleted
            }
        })
            .then(function (response) {
                setProjectList(response.data);
                setIsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false)
            })
    }

    const toggleShowDeleted = () => {
        setShowDeleted(!showDeleted)
    }

    const handleRecovery = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, recover it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`/api/project/recover/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            text: 'The project has been successfully renewed!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProjectList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
            }
        })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, archive it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/project/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'The project was successfully archived!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProjectList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Project Manager</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-primary rounded-0 mx-1"
                            to="/create"> <FontAwesomeIcon icon={faPlus} /> Create New Project
                        </Link>

                        <button
                            onClick={toggleShowDeleted}
                            className="btn btn-outline-danger rounded-0 mx-1"
                            disabled={isLoading}>

                            {isLoading ? <div className="running-dots"></div> : (showDeleted ? 'All Projects' : 'Archived Projects')}
                        </button>
                    </div>
                    <div className="card-body">

                        <table className="table table-striped table-bordered table-responsive-md">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th width="240px">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projectList.length === 0 ? <tr><td colSpan="6" className="text-center py-2">No one has created an article yet.</td></tr> : projectList.map((project, key)=>{
                                return (
                                    <tr key={key}>
                                        <td>{project.id}</td>
                                        <td>{project.name}</td>
                                        <td>{project.description.length > 100 ? project.description.substring(0,100) + ' >>>' : project.description}</td>
                                        <td>{moment(project.created_at).format('DD.MM.YYYY - HH:MM:ss')}</td>
                                        <td>{moment(project.updated_at).format('DD.MM.YYYY - HH:MM:ss')}</td>
                                        <td>
                                            <Link
                                                to={`/show/${project.id}`}
                                                className="btn btn-outline-info  rounded-0">
                                                <FontAwesomeIcon icon={faEye} />
                                            </Link>
                                            {!showDeleted && (
                                                <Link
                                                    className="btn btn-outline-success rounded-0"
                                                    to={`/edit/${project.id}`}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={ () => showDeleted ? handleRecovery(project.id) : handleDelete(project.id)}
                                                className="btn btn-outline-danger rounded-0 mx-1">
                                                {isLoading ? <div className="mini-running-dots"></div> : (showDeleted ? <FontAwesomeIcon icon={faRotateLeft} /> : <FontAwesomeIcon icon={faBoxArchive} />)}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectList;