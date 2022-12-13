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
      '0x0c1f9c134381319ef35ad7fd3f667ad0113f14a90c5f65c9ebee9f1ec952380f',
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
    const proof = service.getProof(inviteList, inviteList[0])
    expect(proof).toEqual([
      '0xf4444058e8b49003d0c4555f4214d701e3731aa3a3601c8ffc3739c168e264a1',
    ])
  })
})
