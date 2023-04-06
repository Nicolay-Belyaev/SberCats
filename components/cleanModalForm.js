const cleanModalForm = () => {
    for (const modalFormElement of modalForm.elements) {
        modalFormElement.value = null
    }
}