
import React from "react";
import { Button, Container, TextField, List, Select, MenuItem } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

class TodoList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { task: '', updateTask: {}, taskList: [], selectedFilter: 'all', open: false };
        this.updateTaskTitle = this.updateTaskTitle.bind(this);

    }

    handleClickOpen = (task) => {
        this.setState({ open: true, updateTask: task })
    };

    handleClose = () => {
        this.setState({ open: false })
    };

    handleUpdatTaskTextChange = (event) => {
        let task = this.state.updateTask;
        task.task = event.target.value
        this.setState({ updateTask: task })
    };

    async componentDidMount() {
        this.getTask('all');
    }

    async getTask(type) {
        const response = await fetch('http://localhost:3000/task/all/?type=' + type);
        const data = await response.json();
        this.setState({ taskList: data['task'] })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.addNewTask();
    }

    async addNewTask() {
        const response = await fetch('http://localhost:3000/task/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({
                "task": this.state.task
            })
        });
        const data = await response.json();
        this.state.taskList.push(data['task'])
        this.setState({ taskList: this.state.taskList, task: "" });
    }

    async updateTask(task, status) {
        await fetch('http://localhost:3000/task/' + task.id + "/", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({
                "task": task.task,
                "status": status === true ? 'done' : 'active'
            })
        });
        this.getTask(this.state.selectedFilter);
    }

    updateTaskTitle() {
        this.updateTask(this.state.updateTask, false);
        this.setState({ open: false })
    }

    async deleteTask(id) {
        await fetch('http://localhost:3000/task/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({
                "id": id
            })
        });
        this.getTask(this.state.selectedFilter);
    }

    onTaskInputChange = (event) => {
        this.setState({ task: event.target.value });
    }

    onFilterChange = (event) => {
        this.setState({ selectedFilter: event.target.value });
        this.getTask(event.target.value);
    };

    render() {
        return (
            <div>
                <div>
                    <br />
                    <br />
                    <Container maxWidth="sm">
                        <form onSubmit={this.onSubmit}>
                            <TextField onChange={this.onTaskInputChange} id="outlined-basic" label="Outlined" variant="outlined" />
                            &nbsp;&nbsp;
                            <Button variant="contained" type="submit" color="primary">
                                Add new task
                        </Button>
                        </form>
                        <br />
                        <Select
                            style={{ width: `100%` }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.selectedFilter}
                            onChange={this.onFilterChange}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                        </Select>
                    </Container>
                </div>
                <div>
                    <Container maxWidth="sm">
                        <List>
                            {this.state.taskList.map((value) => {
                                const labelId = `checkbox-list-label-${value}`;
                                return (
                                    <ListItem key={value.id} role={undefined} dense button>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                tabIndex={-1}
                                                checked={value.status === 'done' ? true : false}
                                                onChange={e => {
                                                    this.updateTask(value, e.target.checked)
                                                }}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value.task} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="comments">
                                                <div onClick={() => {
                                                    this.handleClickOpen(value)
                                                }}>
                                                    <EditIcon />
                                                </div>
                                            </IconButton>
                                            <IconButton edge="end" aria-label="comments">
                                                <div onClick={() => {
                                                    this.deleteTask(value.id)
                                                }}>
                                                    <DeleteIcon />
                                                </div>

                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Container>
                </div>
                <div>
                    <div>
                        \<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Update Task</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Task"
                                    onChange={this.handleUpdatTaskTextChange}
                                    value={this.state.updateTask['task']}
                                    type="text"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                                 </Button>
                                <Button type="button" onClick={this.updateTaskTitle} color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>

        );
    }
}

export default TodoList
