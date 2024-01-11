import {FaTrash} from 'react-icons/fa'
import {Client, ClientCache} from '../shared.types'
import {useMutation} from '@apollo/client'
import {DELETE_CLIENT} from '../mutations/client-mutations'
import {GET_CLIENTS} from '../queries/client-queries'
import {GET_PROJECTS} from '../queries/project-queries'

type Props = {
  client: Client
}

export default function ClientRow({client}: Props) {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: {id: client.id},
    refetchQueries: [{query: GET_CLIENTS}, {query: GET_PROJECTS}],
    // update(cache, {data: {deleteClient}}) {
    //   const {clients} = cache.readQuery<ClientCache>({query: GET_CLIENTS})!
    //   cache.writeQuery({
    //     query: GET_CLIENTS,
    //     data: {
    //       clients: clients.filter(
    //         (client: Client) => client.id !== deleteClient.id
    //       ),
    //     },
    //   })
    // },
  })
  const {name, email, phone} = client
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        <button
          className='btn btn-danger btn-sm'
          onClick={() => deleteClient()}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  )
}
