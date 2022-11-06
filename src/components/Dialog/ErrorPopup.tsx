import { AutButton } from "@components/AutButton";
import { Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import DialogWrapper from "./DialogWrapper";

const ErrorDialog = ({
  mode = "light",
  open,
  hasRetry = false,
  handleClose,
  subtitle,
  message,
  fullScreen = false
}: any) => {
  return (
    <DialogWrapper
      open={open}
      fullScreen={fullScreen}
      actions={
        <AutButton
          onClick={() => handleClose("close")}
          sx={{
            width: pxToRem(250),
            height: pxToRem(50)
          }}
          type="submit"
          color="primary"
          variant="outlined"
        >
          Dismiss
        </AutButton>
      }
    >
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <Typography
          sx={{ color: "red", textAlign: "center", mt: 2 }}
          component="div"
          variant="subtitle2"
        >
          {message}
        </Typography>
        <Typography
          sx={{
            color: mode === "light" ? "primary.main" : "text.primary",
            textAlign: "center",
            mt: 2
          }}
          component="div"
          variant="body2"
        >
          {subtitle}
        </Typography>
        {hasRetry && (
          <AutButton
            onClick={() => handleClose("retry")}
            type="button"
            color="primary"
            variant="outlined"
          >
            Retry
          </AutButton>
        )}
      </div>
    </DialogWrapper>
  );
};

export default ErrorDialog;
