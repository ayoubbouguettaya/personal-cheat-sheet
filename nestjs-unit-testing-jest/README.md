## Unit testing with Jest on Nestjs Applications

### Test Doubles: 
Fakes, stubs, and mocks all belong to the category of test doubles. A test double is an object or system you use in a test instead of something else.

- Fakes: an object with limited capabilities (for the purposes of testing), e.g. a fake web service. Fake has business behavior. You can drive a fake to behave in different ways by giving it different data. Fakes can be used when you can’t use a real implementation in your test.

- Mock: an object on which you set expectations. A mock has expectations about the way it should be called, and a test should fail if it’s not called that way. Mocks are used to test interactions between objects.

- Stub: an object that provides predefined answers to method calls. A stub has no logic and only returns what you tell it to return.

In case you are interested, here is a good discussion on fake/mock/stub.
https://stackoverflow.com/questions/346372/whats-the-difference-between-faking-mocking-and-stubbing

- Spy: Spy, spies on the caller. Often used to make sure a particular method has been called.

### Jest cheat cheet
https://devhints.io/jest

### Mock with GoLevelUp / Jest-ts

https://www.npmjs.com/package/@golevelup/ts-jest


###  Advanced Testing Strategies with Mocks in NestJS

https://trilon.io/blog/advanced-testing-strategies-with-mocks-in-nestjs

### Humble Object (martinfowler)
https://martinfowler.com/bliki/HumbleObject.html


### Mocking aren't stubs (martinfowler)

https://martinfowler.com/articles/mocksArentStubs.html

### javascript-testing-best-practices Github

https://github.com/goldbergyoni/javascript-testing-best-practices#-%EF%B8%8F-12-structure-tests-by-the-aaa-pattern

### Samples

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