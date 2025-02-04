import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { MouseEvent as ReactMouseEvent } from "react";

import { ButtonType, Button } from "@src/ui/components/Button";
import { FullModalContent, FullModalFooter, FullModalHeader } from "@src/ui/components/FullModal";

import { style } from "./style";

export interface BasicModalProps {
  isOpenModal: boolean;
  reject: (e: ReactMouseEvent) => void;
  accept: (e: ReactMouseEvent) => void;
}

export const ConfirmDangerModal = ({ isOpenModal, reject, accept }: BasicModalProps): JSX.Element => (
  <Modal
    aria-describedby="modal-modal-description"
    aria-labelledby="modal-modal-title"
    data-testid="danger-modal"
    open={isOpenModal}
    onClose={reject}
  >
    <Box sx={style}>
      <FullModalHeader>Danger Action</FullModalHeader>

      <FullModalContent className="flex flex-col items-center">
        <div className="font-bold mt-4">Are you absolutely sure?</div>
      </FullModalContent>

      <FullModalFooter>
        <Button buttonType={ButtonType.SECONDARY} data-testid="danger-modal-reject" onClick={reject}>
          No
        </Button>

        <Button className="ml-2 " data-testid="danger-modal-accept" onClick={accept}>
          Yes
        </Button>
      </FullModalFooter>
    </Box>
  </Modal>
);
