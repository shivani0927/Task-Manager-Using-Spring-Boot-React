package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;

    public TaskService(TaskRepository taskRepo, UserRepository userRepo){
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepo.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public TaskDto getById(Long id) {
        Task t = taskRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        User current = getCurrentUser();
        boolean isAdmin = current.getRoles().contains("ROLE_ADMIN");

        // Security Check: Only the owner or an Admin can view the task
        if (!isAdmin && !t.getOwner().getId().equals(current.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        return toDto(t);
    }

    public TaskDto create(TaskDto dto){
        User user = getCurrentUser();
        Task t = new Task();
        t.setTitle(dto.getTitle());
        t.setDescription(dto.getDescription());
        t.setOwner(user);
        Task saved = taskRepo.save(t);
        dto.setId(saved.getId());
        return dto;
    }

    public List<TaskDto> list(){
        User user = getCurrentUser();
        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");
        List<Task> tasks = isAdmin ? taskRepo.findAll() : taskRepo.findByOwner(user);
        return tasks.stream().map(this::toDto).collect(Collectors.toList());
    }

    public TaskDto update(Long id, TaskDto dto){
        Task t = taskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User current = getCurrentUser();
        boolean isAdmin = current.getRoles().contains("ROLE_ADMIN");
        if (!isAdmin && !t.getOwner().getId().equals(current.getId())) {
            throw new RuntimeException("Access denied");
        }
        t.setTitle(dto.getTitle());
        t.setDescription(dto.getDescription());
        taskRepo.save(t);
        return toDto(t);
    }

    public void delete(Long id){
        Task t = taskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User current = getCurrentUser();
        boolean isAdmin = current.getRoles().contains("ROLE_ADMIN");
        if (!isAdmin && !t.getOwner().getId().equals(current.getId())) {
            throw new RuntimeException("Access denied");
        }
        taskRepo.delete(t);
    }

    private TaskDto toDto(Task t) {
        TaskDto dto = new TaskDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        return dto;
    }
}
