import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { Modal } from "bootstrap";
import CloseIcon from "@mui/icons-material/Close";


const EventParticipants = ({ open, onClose, participant }) => {
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
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h4">event participants</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    {participant.length != 0 ? <>
                        {
                            participant.map((person) => {
                                return <Typography sx={{ margin: "10px 0px" }} className='text.center'>hi</Typography>
                            })
                        }</> :
                        <> <Typography sx={{ margin: "10px 0px" }} className='text.center'>no participant on this event</Typography></>}
                </Box>
            </Box>
        </Modal >
    );
}

export default EventParticipants;