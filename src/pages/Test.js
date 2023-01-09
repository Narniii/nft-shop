import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GenerateRandomCode from "react-random-code-generator";
import { utils } from "near-api-js";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Modal,
} from "@mui/material";
import { BG_URL, PUBLIC_URL } from "../utils/utils";
import CloseIcon from "@mui/icons-material/Close";
import TxtButton from "../components/TxtButton";
import { useParams, useLocation } from "react-router-dom";
const amountInYocto = utils.format.parseNearAmount("4");

export default function Test() {
  const location = useLocation();
  var transactionHashes = undefined;
  if (location.search) {
    var hash = location.search;
    console.log(hash);
    transactionHashes = hash.slice(hash.indexOf("=") + 1, hash.length);
  }
  const theme = useTheme();
  const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: theme.pallete.darkBox,
    border: `2px solid ${theme.pallete.lightBorder}`,
    width: { xs: "90%", md: "80%", lg: "40%" },
    boxShadow: 24,
    p: 2,
    outline: 0,
    borderRadius: '5px'
  };
  const [price, setPrice] = useState("4");
  const [openModal, setOpenModal] = useState(transactionHashes ? true : false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const userDetails = useSelector((state) => state.userReducer);
  useEffect(() => {
    // console.log(userDetails);
  }, [userDetails]);
  const handleMint = async () => {
    let code = GenerateRandomCode.TextNumCode(10, 10);
    const key = `${userDetails.nftContract.account.accountId}`;
    let royalyObj = {
      "market.bitzio.testnet": 2000,
    };
    royalyObj[key] = 1000;
    try {
      const res = await userDetails.nftContract.nft_mint({
        args: {
          token_id: `${code}`,
          metadata: {
            title: `${code}`,
            description: `4th mint from ${userDetails.nftContract.account.accountId}`,
            media:
              "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
          },
          receiver_id: userDetails.nftContract.account.accountId,
          perpetual_royalties: royalyObj,
        },
        accountId: userDetails.nftContract.account.accountId,
        amount: amountInYocto,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>Test</div>
      <button onClick={() => handleOpen()}>mint</button>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ margin: "10px 0px" }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Mint Nft
            </Typography>
            <CloseIcon
              sx={{ fontSize: 40, cursor: "pointer" }}
              onClick={handleClose}
            />
          </Box>
          <Box className="row">
            <Box className="col-md-2">
              <Typography sx={{ margin: "10px 0px" }}>Title:</Typography>
            </Box>
            <Box className="col-md-10">
              <Typography sx={{ margin: "10px 0px" }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
            <Box className="col-md-2">
              <Typography>Nft image:</Typography>
            </Box>
            <Box className="col-md-10">
              <Box
                sx={{
                  height: { xs: 250, md: 200 },
                  width: { xs: 250, md: 200 },
                  backgroundImage: BG_URL(PUBLIC_URL("images/kaf.jpg")),
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Box>
            <Box className="col-md-2">
              <Typography sx={{ margin: "10px 0px" }}>Description:</Typography>
            </Box>
            <Box className="col-md-10">
              <Typography sx={{ margin: "10px 0px" }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
            <Box className="col-md-2">
              <Typography sx={{ margin: "10px 0px" }}>Price:</Typography>
            </Box>
            <Box className="col-md-10">
              <Typography sx={{ margin: "10px 0px" }}>geroon</Typography>
            </Box>
            <div className="text-center" style={{ margin: "10px 0px" }}>
              {transactionHashes ? (
                <>
                  <Typography sx={{ color: "green", margin: "10px 0px" }}>
                    NFT minted successfully
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ color: "#04a5c3" }}>
                      transaction hash:
                    </Typography>
                    <Typography>{transactionHashes}</Typography>
                  </Box>
                </>
              ) : (
                <TxtButton
                  text="Mint"
                  bgColor={"#04a5c3"}
                  color="white"
                  displayType="inline-block"
                  borderColor={"#04a5c3"}
                  onClick={handleMint}
                />
              )}
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
