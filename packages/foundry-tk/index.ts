import ERC1155Artifact from './out/MyERC1155.sol/MyERC1155.json';
import ERC721Artifact from './out/MyERC721.sol/MyERC721.json';

export const artifacts = {
  ERC721: { abi: ERC721Artifact.abi, bytecode: ERC721Artifact.bytecode },
  ERC1155: { abi: ERC1155Artifact.abi, bytecode: ERC1155Artifact.bytecode },
};
