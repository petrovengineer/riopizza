import Modal from '../../modal'
import Select from 'react-select';
export default function NewItem({closeModal, selectedGroup, handleChangeGroup, groups, create}){
    return (
        <Modal close={closeModal}>
            <span>Новый элемент</span>
            <div>
                <div className='col-12'>
                    <input type="text" id="value" placeholder='Новый элемент'/>
                </div>
                <div className='col-12 mt-2'><input type="text" id="sort" placeholder='Место в списке'/></div>
                <div className='col-12 col-md-6 mt-2'>
                    <Select
                        value={selectedGroup}
                        onChange={handleChangeGroup}
                        options={groups}
                        instanceId="selectGroup"
                        placeholder='Группа'
                    />
                </div>
            </div>
            <button className='btn btn-success' onClick={create}>Создать</button>
        </Modal>
    )
}