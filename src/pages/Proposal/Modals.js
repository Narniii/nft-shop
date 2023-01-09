import { Box, Modal, TextField, Typography, useTheme } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";









export const UpVoters = ({ open, onClose, voters }) => {
    const theme = useTheme()
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "40%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid white" }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h4">Proposal Up Voters</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    {voters ? <>
                        {voters.map((voter) => {
                            return <>{voter.is_upvote ? <Typography sx={{ margin: "10px 0px" }} className='text.center'>#{voter.nft_owner_id}</Typography> : undefined}</>
                        })}
                    </> : <Typography sx={{ margin: "10px 0px" }} className='text.center'>no voters yet</Typography>}
                </Box>
            </Box>
        </Modal>
    );
}












export const DownVoters = ({ open, onClose, voters }) => {
    const theme = useTheme()
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "40%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid white" }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h4">Proposal Down Voters</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    {voters? <>
                        {voters.map((voter) => {
                            return <>{!voter.is_upvote ? <Typography sx={{ margin: "10px 0px" }} className='text.center'>#{voter.nft_owner_id}</Typography> : undefined}</>
                        })}
                    </> : <Typography sx={{ margin: "10px 0px" }} className='text.center'>no voters yet</Typography>}
                </Box>
            </Box>
        </Modal>
    );
}