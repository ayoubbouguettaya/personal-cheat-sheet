### Samples

Testing a service with the help of @golevelup for Mocking the service depencies.

```{ts}
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
//        {
//          provide: HttpService,
//          useValue: createMock<HttpService>(),
//        },
      ],
    }).
    .useMocker(createMock)
    .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  // ... tests


  describe('getPokemon', () => {
    // other tests...

    it('valid pokemon ID to return the pokemon name', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: { name: `bulbasaur` },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = pokemonService.getPokemon(1);

      await expect(getPokemon).resolves.toBe('bulbasaur');
    });
  });
});
```
