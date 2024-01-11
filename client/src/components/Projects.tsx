import Spinner from './Spinner'
import {useQuery} from '@apollo/client'
import {GET_PROJECTS} from '../queries/project-queries'
import {Project} from '../shared.types'
import ProjectCard from './ProjectCard'

export default function Projects() {
  const {loading, error, data} = useQuery(GET_PROJECTS)

  if (loading) return <Spinner />
  if (error) return <p>Something Went Wrong</p>
  return (
    <>
      {data.projects.length > 0 ? (
        <div className='row mt-5'>
          {data.projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p>No Projects</p>
      )}
    </>
  )
}