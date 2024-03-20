function addEquipment(){
    const formData = new FormData(document.getElementById('addEquipmentForm'));
    fetch('/forest/add', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success'){
            // location.href = '/addEquipmentSuccess/' + data.equipmentId;
        }
        else{
            alert('Failed to add equipment');
            document.getElementsByTagName('error').innerHTML = "登録に失敗しました。詳しくはサーバーログを確認してください。";
        }
    });
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('wheel', event => event.preventDefault(), {passive: false});
});
