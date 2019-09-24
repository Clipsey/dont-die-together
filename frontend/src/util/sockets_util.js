export const emitSetup = (socket) => {
  return (event, data) => socket.emit(event, data);
}
export const onSetup = (socket) => {
  return (event, cb) => socket.on(event, cb);
}