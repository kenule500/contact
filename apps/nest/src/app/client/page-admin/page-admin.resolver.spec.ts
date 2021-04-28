import { Test, TestingModule } from '@nestjs/testing';
import { PageAdminResolver } from './page-admin.resolver';

describe('PageAdminResolver', () => {
  let resolver: PageAdminResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageAdminResolver],
    }).compile();

    resolver = module.get<PageAdminResolver>(PageAdminResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
