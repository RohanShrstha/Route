package com.findmrotue.fmr.controller.busstop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.findmrotue.fmr.abstracts.BaseController;
import com.findmrotue.fmr.config.CustomMessageSource;
import com.findmrotue.fmr.entity.bustop.BusStop;
import com.findmrotue.fmr.service.busstop.BusStopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/bus-stop")
public class BusStopController extends BaseController {
    
    private final BusStopService service;
    private final CustomMessageSource customMessageSource;
    private final ObjectMapper mapper;

    public BusStopController(BusStopService service, CustomMessageSource customMessageSource, ObjectMapper mapper) {
        this.service = service;
        this.customMessageSource = customMessageSource;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BusStop b) throws IOException {
        BusStop res = service.create(b);
        return ResponseEntity.ok(
                successResponse(customMessageSource.get(
                        "crud.create", customMessageSource.get("message")),res)
        );
    }

    @GetMapping
    public ResponseEntity<?> getAll(){
        List<BusStop> dtos = service.getAll();
        return ResponseEntity.ok(
                successResponse(customMessageSource.get(
                        "crud.get.all", customMessageSource.get("message")),dtos)
        );
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id){
        BusStop dto = service.getById(id);
        return ResponseEntity.ok(
                successResponse(customMessageSource.get(
                        "crud.get", customMessageSource.get("message")),dto)
        );
    }


    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") Integer id){
        service.deleteById(id);
        return ResponseEntity.ok(
                successResponse(customMessageSource.get(
                        "crud.delete", customMessageSource.get("message")),null)
        );
    }
}
