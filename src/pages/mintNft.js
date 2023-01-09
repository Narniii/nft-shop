// const handleMint = async (e) => {
//     e.preventDefault()
//     setApiLoading(true)
//     setCollectionErr(undefined)
//     setErr(undefined)
//     if (nft.img === undefined) {
//         setErr('Please select an image for your NFT image.')
//         setApiLoading(false)
//         return
//     }
//     else if (nft.name.length == 0) {
//         setErr('Please enter your NFT name')
//         setApiLoading(false)
//         return
//     }
//     else if (nft.description.length == 0) {
//         setErr('Please enter your NFT description.')
//         setApiLoading(false)
//         return
//     }
//     else if (nft.collection === -1) {
//         setCollectionErr(true)
//         setApiLoading(false)
//         return
//     }
//     else if (nft.royalty.length == 0) {
//         setErr('Please define your desired royalty percentage.')
//         setApiLoading(false)
//         return
//     }
//     else if (nft.royalty < 0 || nft.royalty > 10) {
//         setErr('Royalty percentage must be between 0 and 10.')
//         setApiLoading(false)
//         return
//     }
//     // else if (nft.supply.length == 0) {
//     //     setErr('Please enter your NFT supply.')
//     //     setApiLoading(false)
//     //     return
//     // }
//     else if (nft.price.length == 0) {
//         setErr('Please enter your NFT price.')
//         setApiLoading(false)
//         return
//     }
//     else {
//         setErr(undefined)
//         setCollectionErr(undefined)
//     }
//     var ipfsCid = await ipfsUpload()
//     var ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
//     let code = GenerateRandomCode.TextNumCode(10, 10);
//     const key = `${userDetails.nftContract.account.accountId}`;
//     let royaltyObj = {
//         "market.bitzio.testnet": 2000,
//     };
//     royaltyObj[key] = nft.royalty * 1000;
//     localStorage.setItem("newly created nft id", code)
//     try {
//         const res = await userDetails.nftContract.nft_mint({
//             args: {
//                 token_id: `${code}`,
//                 metadata: {
//                     title: `${nft.name}`,
//                     description: `${nft.description}`,
//                     media: ipfsUrl,
//                     extra: JSON.stringify({
//                         collection_id: nft.collection
//                     })
//                 },
//                 receiver_id: userDetails.nftContract.account.accountId,
//                 perpetual_royalties: royaltyObj,
//             },
//             accountId: userDetails.nftContract.account.accountId,
//             amount: utils.format.parseNearAmount(`1`)
//         });
//     } catch (err) {
//         console.log(err);
//     }
// };