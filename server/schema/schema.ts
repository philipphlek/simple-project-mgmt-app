import Project from '../models/Project'
import Client from '../models/Client'

import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

enum ProjectStatus {
  New = 'Not Started',
  Progress = 'In Progress',
  Completed = 'Completed',
}

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    status: {type: GraphQLString},
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      },
    },
  }),
})

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    phone: {type: GraphQLString},
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find()
      },
    },
    project: {
      type: ProjectType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return Project.findById(args.id)
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find()
      },
    },
    client: {
      type: ClientType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return Client.findById(args.id)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLNonNull(GraphQLString)},
      },
      resolve: (parent, args) => {
        return Client.create({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
      resolve: (parent, args) => {
        Project.find({clientId: args.id}).then((projects) => {
          projects.forEach((project) => {
            project.deleteOne().exec()
          })
        })
        return Client.findByIdAndDelete(args.id)
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: {value: ProjectStatus.New},
              progress: {value: ProjectStatus.Progress},
              completed: {value: ProjectStatus.Completed},
            },
          }),
          defaultValue: ProjectStatus.Progress,
        },
        clientId: {type: GraphQLNonNull(GraphQLID)},
      },
      resolve: (parent, {name, description, status, clientId}) =>
        Project.create({name, description, status, clientId}),
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
      resolve: (parent, args) => Project.findByIdAndDelete(args.id),
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: {value: ProjectStatus.New},
              progress: {value: ProjectStatus.Progress},
              completed: {value: ProjectStatus.Completed},
            },
          }),
        },
      },
      resolve: (parent, args) =>
        Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          {new: true}
        ),
    },
  },
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation,
})
