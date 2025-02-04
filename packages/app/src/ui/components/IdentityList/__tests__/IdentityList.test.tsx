/**
 * @jest-environment jsdom
 */

import { act, render, screen, fireEvent } from "@testing-library/react";

import { ZERO_ADDRESS } from "@src/config/const";
import { IdentityData } from "@src/types";
import { useAppDispatch } from "@src/ui/ducks/hooks";
import { deleteIdentity, setIdentityName, useIdentities } from "@src/ui/ducks/identities";

import { IdentityList, IdentityListProps } from "..";

jest.mock("@src/ui/ducks/hooks", (): unknown => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("@src/ui/ducks/identities", (): unknown => ({
  deleteIdentity: jest.fn(),
  setIdentityName: jest.fn(),
  useIdentities: jest.fn(),
  createIdentityRequest: jest.fn(),
}));

describe("ui/components/IdentityList", () => {
  const mockDispatch = jest.fn(() => Promise.resolve());

  const defaultIdentities: IdentityData[] = [
    {
      commitment: "0",
      metadata: {
        account: ZERO_ADDRESS,
        name: "Account #0",
        identityStrategy: "interrep",
        web2Provider: "twitter",
        groups: [],
        host: "http://localhost:3000",
      },
    },
    {
      commitment: "1",
      metadata: {
        account: ZERO_ADDRESS,
        name: "Account #1",
        identityStrategy: "random",
        groups: [],
      },
    },
  ];

  const defaultProps: IdentityListProps = {
    isShowAddNew: true,
    isShowMenu: true,
    identities: defaultIdentities,
    selectedCommitment: defaultIdentities[0].commitment,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

    (useIdentities as jest.Mock).mockReturnValue(defaultIdentities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render properly", async () => {
    render(<IdentityList {...defaultProps} isShowAddNew={false} isShowMenu={false} />);

    const identityName1 = await screen.findByText(defaultIdentities[0].metadata.name);
    const identityName2 = await screen.findByText(defaultIdentities[1].metadata.name);

    expect(identityName1).toBeInTheDocument();
    expect(identityName2).toBeInTheDocument();
  });

  test("should render without identities properly", async () => {
    render(<IdentityList {...defaultProps} identities={[]} />);

    const empty = await screen.findByText("No identities available");

    expect(empty).toBeInTheDocument();
  });

  test("should select identity properly", async () => {
    render(<IdentityList {...defaultProps} />);

    const selectIcon = await screen.findByTestId(`identity-select-${defaultIdentities[1].commitment}`);
    act(() => selectIcon.click());

    expect(defaultProps.onSelect).toBeCalledTimes(1);
  });

  test("should rename identity properly", async () => {
    render(<IdentityList {...defaultProps} />);

    const [menuIcon] = await screen.findAllByTestId("menu");
    act(() => menuIcon.click());

    const renameButton = await screen.findByText("Rename");
    act(() => renameButton.click());

    const input = await screen.findByDisplayValue(defaultIdentities[0].metadata.name);
    fireEvent.change(input, { target: { value: "New name" } });

    const renameIcon = await screen.findByTestId(`identity-rename-${defaultIdentities[0].commitment}`);
    await act(async () => Promise.resolve(renameIcon.click()));

    expect(setIdentityName).toBeCalledTimes(1);
    expect(setIdentityName).toBeCalledWith(defaultIdentities[0].commitment, "New name");
    expect(mockDispatch).toBeCalledTimes(1);
  });

  test("should accept to delete identity properly", async () => {
    render(<IdentityList {...defaultProps} selectedCommitment={undefined} />);

    const [menuIcon] = await screen.findAllByTestId("menu");
    act(() => menuIcon.click());

    const deleteButton = await screen.findByText("Delete");
    act(() => deleteButton.click());

    const dangerModal = await screen.findByTestId("danger-modal");

    expect(dangerModal).toBeInTheDocument();

    const dangerModalaccept = await screen.findByTestId("danger-modal-accept");
    await act(async () => Promise.resolve(dangerModalaccept.click()));

    expect(deleteIdentity).toBeCalledTimes(1);
    expect(deleteIdentity).toBeCalledWith(defaultIdentities[0].commitment);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(dangerModal).not.toBeInTheDocument();
  });

  test("should reject to delete identity properly", async () => {
    render(<IdentityList {...defaultProps} selectedCommitment={undefined} />);

    const [menuIcon] = await screen.findAllByTestId("menu");
    act(() => menuIcon.click());

    const deleteButton = await screen.findByText("Delete");
    act(() => deleteButton.click());

    const dangerModal = await screen.findByTestId("danger-modal");

    expect(dangerModal).toBeInTheDocument();

    const dangerModalreject = await screen.findByTestId("danger-modal-reject");
    await act(async () => Promise.resolve(dangerModalreject.click()));

    expect(deleteIdentity).toBeCalledTimes(0);
    expect(mockDispatch).toBeCalledTimes(0);
    expect(dangerModal).not.toBeInTheDocument();
  });

  test("should open create identity modal properly", async () => {
    render(<IdentityList {...defaultProps} />);

    const createIdentityButton = await screen.findByTestId("create-new-identity");
    await act(async () => Promise.resolve(createIdentityButton.click()));

    expect(mockDispatch).toBeCalledTimes(1);
  });
});
