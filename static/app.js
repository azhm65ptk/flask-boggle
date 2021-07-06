

class BoggleGame {

    // make a new game at this DOM id

    constructor(boardID, secs = 60) {
        this.secs=secs;
        this.showTimer();
        this.score = 0;
        this.words = new Set();
        this.board = $('#'+boardID);

        this.timer=setInterval(this.tick.bind(this),1000)


        $(".add-word", this.board).on('submit', this.handleSubmit.bind(this))
    }

    /* show word in list of words */
  
    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
      }


    //show score in html
    showScore() {
        $('.score', this.board).text(this.score)
    }

    showMessage(msg, cls) {
        $(".msg", this.board).text(msg).removeClass()
            .addClass(`msg ${cls}`)

    }

    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $(".word", this.board);
    
        let word = $word.val();
        if (!word) return;
    
        if (this.words.has(word)) {
          this.showMessage(`Already found ${word}`, "err");
          return;
        }
    
        // check server for validity
        const resp = await axios.get("/check-word", { params: { word: word }});
        if (resp.data.result === "not-word") {
          this.showMessage(`${word} is not a valid English word`, "err");
        } else if (resp.data.result === "not-on-board") {
          this.showMessage(`${word} is not a valid word on this board`, "err");
        } else {
          this.showWord(word);
          this.score += word.length;
          this.showScore();
          this.words.add(word);
          this.showMessage(`Added: ${word}, ok`);
        }
    
        $word.val("").focus();
      }

      showTimer(){
          $('.timer',this.board).text(this.secs)
      }


      async tick(){
          this.secs-=1;
          this.showTimer();

          if(this.secs===0){
              clearInterval(this.timer);
              await this.scoreGame();
          }
      }
    

      async scoreGame(){
          $('.add-word',this.board).hide();
          const response= await axios.post('/post-score',{ score: this.score});

          if(response.data.brokeRecord){
              this.showMessage(`New Recrod: ${this.score}`)
          }
          else {
              this.showMessage(`Your final score is: ${this.score}`)
          }
      }

}


