import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';

import { UsuariosResolver } from './resolvers/usuarios.resolver';
import { RecetasResolver } from './resolvers/recetas.resolver';
import { UsuariosRestService } from './services/usuarios-rest.service';
import { RecetasRestService } from './services/recetas-rest.service';
@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: true,
        }),
        HttpModule.register({
            baseURL: 'http://localhost:3000',
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    providers: [
        // Resolvers
        UsuariosResolver,
        RecetasResolver,
        // Services
        UsuariosRestService,
        RecetasRestService,
    ],
})
export class AppModule {}