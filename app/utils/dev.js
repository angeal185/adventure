const dev = {
  addNpc(i){

    let y = (i[1]);
    let arr = [
      [i[0], y, i[2]],
      [i[0],y, (i[2]-1)],
      [(i[0]-1), y, i[2]],
      [(i[0]-1), y, (i[2]-1)]
    ]
    console.log(JSON.stringify(arr))
  }
}


module.exports = dev;
