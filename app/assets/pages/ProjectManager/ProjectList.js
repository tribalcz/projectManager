import React,{ useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';
import moment from 'moment';
import Pagination from 'react-bootstrap/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxArchive,
    faEdit,
    faEye,
    faRotateLeft,
    faPlus,
    faCaretDown,
    faCaretUp,
    faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../components/forms/SearchInput";
import '../css/loader.css';

function ProjectList() {
    const  [projectList, setProjectList] = useState([]) //state pro uložení projektů
    const  [showDeleted, setShowDeleted] = useState(false) //state pro zobrazení smazaných projektů
    const  [isLoading, setIsLoading] = useState(false) //state pro zobrazení loaderu
    const  [searchQuery, setSearchQuery] = useState('') //state pro vyhledávání
    const  [initialLoad, setInitialLoad] = useState(true)
    const  [currentPage, setCurrentPage] = useState(1);
    const  [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
            fetchProjectList()

        const interval = setInterval(() => {
            updateProjectList();
        }, 300000);

        return () => clearInterval(interval);
    }, [showDeleted])


    const fetchProjectList = (page = 1) => {
        setIsLoading(true)
        axios.get('/api/project', {
            params: {
                showDeleted: showDeleted,
                page: page
            }
        })
            .then(function (response) {
                const { data, totalPage } = response.data;
                setProjectList(data);
                setCurrentPage(page);
                setTotalPages(totalPage)
                setIsLoading(false)
                setInitialLoad(false)
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false)
            })
    }

    const updateProjectList = () => {
        if (!initialLoad) {
            setIsLoading(true);
            axios.get('/api/project/updated-records')
            .then(function (response) {
                const updatedProjects = response.data;
                setProjectList(prevProjectList => {
                    return prevProjectList.map(project => {
                        const updatedProject = updatedProjects.find(updatedProj => updatedProj.id === project.id);
                        return updatedProject ? updatedProject : project;
                    });
                });
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            });
        }
    }

    const handleSearch = (value) => {
        setSearchQuery(value);
        setProjectList([]);
        setIsLoading(true);
        axios.get('/api/project/find', {
            params: {
                searchQuery: value,
            }
        })
            .then(function (response) {
                setProjectList(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            })
    }

    //Zobrazení smazaných projektů
    const toggleShowDeleted = () => {
        setShowDeleted(!showDeleted)
    }

    //Obnovení projektu
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

    //softDelete projektu
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

    const renderPageNumbers = () => {
        const range = 3; // Počet stránek před a po aktuální stránce

        let pageNumbers = [];
        for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
            pageNumbers.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => fetchProjectList(i)}>
                    {i}
                </Pagination.Item>
                );
        }
        return pageNumbers; // Return pole stránek
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Project Manager</h2>
                <div className="col-sm-8 mx-auto">
                    <SearchInput onSearch={handleSearch} />
                </div>
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
                        <button
                            onClick={updateProjectList}
                            className="btn btn-outline-danger rounded-0 mx-1"
                            disabled={isLoading}>
                            {initialLoad ? <div className="running-dots"></div> : (isLoading ? <FontAwesomeIcon icon={faArrowsRotate} className={"fa-spin"} /> : <FontAwesomeIcon icon={faArrowsRotate} />)}

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
                                                className="btn btn-outline-info rounded-0 mx-1">
                                                <FontAwesomeIcon icon={faEye} />
                                            </Link>
                                            {!showDeleted && !project.deleted_at && (
                                                <Link
                                                    className="btn btn-outline-success rounded-0 mx-1"
                                                    to={`/edit/${project.id}`}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={ () => showDeleted || project.deleted_at ? handleRecovery(project.id) : handleDelete(project.id)}
                                                className="btn btn-outline-danger rounded-0 mx-1">
                                                {isLoading ? <div className="mini-running-dots"></div> : (showDeleted || project.deleted_at ? <FontAwesomeIcon icon={faRotateLeft} /> : <FontAwesomeIcon icon={faBoxArchive} />)}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.First onClick={() => fetchProjectList(1)} />
                            <Pagination.Prev onClick={() => fetchProjectList(currentPage - 1)} />

                            {renderPageNumbers()}

                            <Pagination.Next onClick={() => fetchProjectList(currentPage + 1)} />
                            <Pagination.Last onClick={() => fetchProjectList(totalPages)} />
                        </Pagination>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectList;