current = "Introduction";

    genList = () => {
      document.getElementById("notes").innerHTML = "";
      Object.keys(localStorage).forEach(x=>{
        document.getElementById("notes").innerHTML += '<span class="tab"><a style="overflow:hidden;" onclick="loadDoc(\''+x+'\')" href="#">'+x+'</a>'+(x!="Introduction"?'<span><a onclick="rename(\''+x+'\')" href="#" class="rename">Rename</a> <a onclick="remove(\''+x+'\')" href="#" class="remove">Remove</a></span></span>':'');
      });
      document.getElementById("notes").innerHTML += '<span class="tab"><a onclick="newFile()" href="#">New File</a></span>'
    }

    getCur = () => {return current};

    saveDoc = (docFile, content) => {
      localStorage.setItem(docFile, content);
      genList();
    }

    loadDoc = docFile => {
      current = docFile;
      doc = localStorage.getItem(docFile);
      document.getElementById("title").innerHTML = docFile;
      document.getElementById("content").value = doc;
      genList();
    }

    savelocal = () => {
      saver = document.getElementById("saver");
      saver.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(localStorage.getItem(getCur()));
      saver.download = getCur() + '.txt';
      saver.click();
    }

    save = () => saveDoc(getCur(), document.getElementById("content").value);

    remove = item => {localStorage.removeItem(item);getCur()==item?loadDoc("Introduction"):loadDoc(getCur())}

    async function rename(old) {
      const { value: newfilename } = await Swal.fire({
        heightAuto: false,
        title: `What do you want to rename ${old} to?`,
        input: 'text',
        showCancelButton: true
      });
      if (newfilename) {
        saveDoc(newfilename, localStorage.getItem(old));
        current = newfilename; 
        remove(old);
        loadDoc(current);
      }
    }

    async function newFile() {
      const { value: filename } = await Swal.fire({
        heightAuto: false,
        title: `What do you want to name your new file?`,
        input: 'text',
        showCancelButton: true
      });
      filename? saveDoc(filename, ""): false;
    }

    reader = new FileReader();

    loadFile = x => {
      reader.readAsBinaryString(x.target.files[0]);
      setTimeout(()=>{saveDoc(x.target.files[0].name, reader.result);},100);
    }

    document.body.onload = () => {
      saveDoc("Introduction", "Welcome to Web Notes, a fork of Xnoe Notes!\nClick here to start writing!");
      loadDoc(getCur());

      document.getElementById("file").addEventListener('change', loadFile, false);
    };