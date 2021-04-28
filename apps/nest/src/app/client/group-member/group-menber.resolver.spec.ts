import { Test, TestingModule } from '@nestjs/testing';
import { GroupMenberResolver } from './group-menber.resolver';

describe('GroupMenberResolver', () => {
  let resolver: GroupMenberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupMenberResolver],
    }).compile();

    resolver = module.get<GroupMenberResolver>(GroupMenberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
