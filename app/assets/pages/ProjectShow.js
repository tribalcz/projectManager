import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout"
import axios from 'axios';
import Swal from 'sweetalert2'

function ProjectShow() {
    const [id, setId] = useState(useParams().id)
    const [project, setProject] = useState({id: '' ,name:'', description:''})
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjectListDetail()
    }, [])

    const fetchProjectListDetail = () => {
        axios.get(`/api/project/${id}`)
            .then(function (response) {
                setProject(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/project/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Project deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        navigate("/");
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
                <h2 className="text-center mt-5 mb-3">Show Project</h2>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <Link
                            className="btn btn-outline-info me-auto rounded-0 mx-1"
                            to="/"> View All Projects
                        </Link>
                        <Link
                            className="btn btn-outline-success rounded-0 mx-1"
                            to={`/edit/${project.id}`}> Edit
                        </Link>
                        <button
                            className="btn btn-outline-danger rounded-0"
                            onClick={()=>handleDelete()}> Delete
                        </button>
                    </div>
                    <div className="card-body">
                        <b className="text-muted">Name:</b>
                        <p>{project.name}</p>
                        <b className="text-muted">Description:</b>
                        <p>{project.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectShow;