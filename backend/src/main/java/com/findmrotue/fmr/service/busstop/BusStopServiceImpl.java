package com.findmrotue.fmr.service.busstop;

import com.findmrotue.fmr.entity.bustop.BusStop;
import com.findmrotue.fmr.repo.busstop.BusStopRepo;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BusStopServiceImpl implements BusStopService {
    private final BusStopRepo repo;

    public BusStopServiceImpl(BusStopRepo repo) {
        this.repo = repo;
    }

    @Override
    public BusStop create(BusStop dto) {
        return repo.save(dto);
    }

    @Override
    public List<BusStop> getAll() {
        return repo.findAll();
    }

    @Override
    public BusStop getById(Integer id) {
        return repo.findById(id).get();
    }

    @Override
    public BusStop update(BusStop dto) {
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        repo.deleteById(id);
    }
}
