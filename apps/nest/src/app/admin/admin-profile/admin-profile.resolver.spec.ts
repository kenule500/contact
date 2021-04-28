import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileResolver } from './admin-profile.resolver';

describe('AdminProfileResolver', () => {
  let resolver: AdminProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminProfileResolver],
    }).compile();

    resolver = module.get<AdminProfileResolver>(AdminProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
