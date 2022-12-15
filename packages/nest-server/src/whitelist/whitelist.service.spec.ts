import { Test, TestingModule } from '@nestjs/testing'
import { WhitelistService } from './whitelist.service'

describe('DummyService', () => {
  let service: WhitelistService
  const inviteList = [
    '0xc241b0c181be16ccd2ed9ef7125cec1cce0b6888',
    '0x61ba8997147106a2444d125af7f201ac66676a10',
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhitelistService],
    }).compile()

    service = module.get<WhitelistService>(WhitelistService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should provide a root for some leave nodes', () => {
    const rootHash = service.computeRoot(inviteList)
    expect(rootHash).toEqual(
      '0xd4d95031fa5d53177eb9ff9b1188a4b92160b497e5ff9bdcc04fbe40ebc1765a',
    )
  })

  it('should return false if given an address which is not part of the invite list', () => {
    const addrOneFalse = '0x0000000000000000000000000000000000000000'
    const addrTwoFalse = '0x61bA8997147106a2444d125af7f201ac66676a10'
    const addrThreeTrue = '0x61ba8997147106a2444d125af7f201ac66676a10'

    expect(service.isAddressPartOfInviteList(inviteList, addrOneFalse)).toBe(
      false,
    )
    expect(service.isAddressPartOfInviteList(inviteList, addrTwoFalse)).toBe(
      false,
    )
    expect(service.isAddressPartOfInviteList(inviteList, addrThreeTrue)).toBe(
      true,
    )
  })

  it('should provide a proof given an invite list an an address from that list', () => {
    const proof = service.getProof(inviteList, inviteList[1])
    expect(proof).toEqual([
      '0x874419f5f43a1214f218e7b2508b8bed9a6e615ea3d443da3fb2d06de11dfc95',
    ])
  })
})
